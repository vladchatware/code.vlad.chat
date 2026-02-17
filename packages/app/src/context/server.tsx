import { createOpencodeClient } from "@opencode-ai/sdk/v2/client"
import { createSimpleContext } from "@opencode-ai/ui/context"
import { batch, createEffect, createMemo, onCleanup } from "solid-js"
import { createStore } from "solid-js/store"
import { usePlatform } from "@/context/platform"
import { Persist, persisted } from "@/utils/persist"

type StoredProject = { worktree: string; expanded: boolean }
type StoredAuth = { type: "basic"; password: string }
const HEALTH_POLL_INTERVAL_MS = 10_000

export function normalizeServerUrl(input: string) {
  const trimmed = input.trim()
  if (!trimmed) return
  const withProtocol = /^https?:\/\//.test(trimmed) ? trimmed : `http://${trimmed}`
  return withProtocol.replace(/\/+$/, "")
}

export function serverDisplayName(url: string) {
  if (!url) return ""
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "")
}

function projectsKey(url: string) {
  if (!url) return ""
  const host = url.replace(/^https?:\/\//, "").split(":")[0]
  if (host === "localhost" || host === "127.0.0.1") return "local"
  return url
}

export const { use: useServer, provider: ServerProvider } = createSimpleContext({
  name: "Server",
  init: (props: { defaultUrl: string; isSidecar?: boolean }) => {
    const platform = usePlatform()

    const [store, setStore, _, ready] = persisted(
      Persist.global("server", ["server.v3"]),
      createStore({
        list: [] as string[],
        currentSidecarUrl: "",
        projects: {} as Record<string, StoredProject[]>,
        lastProject: {} as Record<string, string>,
        auth: {} as Record<string, StoredAuth>,
      }),
    )

    const [state, setState] = createStore({
      active: "",
      healthy: undefined as boolean | undefined,
    })

    const healthy = () => state.healthy
    const defaultUrl = () => normalizeServerUrl(props.defaultUrl)

    function reconcileStartup() {
      const fallback = defaultUrl()
      if (!fallback) return

      const previousSidecarUrl = normalizeServerUrl(store.currentSidecarUrl)
      const list = previousSidecarUrl ? store.list.filter((url) => url !== previousSidecarUrl) : store.list
      if (!props.isSidecar) {
        batch(() => {
          setStore("list", list)
          if (store.currentSidecarUrl) setStore("currentSidecarUrl", "")
          setState("active", fallback)
        })
        return
      }

      const nextList = list.includes(fallback) ? list : [...list, fallback]
      batch(() => {
        setStore("list", nextList)
        setStore("currentSidecarUrl", fallback)
        setState("active", fallback)
      })
    }

    function updateServerList(url: string, remove = false) {
      if (remove) {
        const list = store.list.filter((x) => x !== url)
        const next = state.active === url ? (list[0] ?? defaultUrl() ?? "") : state.active
        batch(() => {
          setStore("list", list)
          setStore("auth", url, undefined!)
          setState("active", next)
        })
        return
      }

      batch(() => {
        if (!store.list.includes(url)) {
          setStore("list", store.list.length, url)
        }
        setState("active", url)
      })
    }

    function setActive(input: string) {
      const url = normalizeServerUrl(input)
      if (!url) return
      setState("active", url)
    }

    function add(input: string) {
      const url = normalizeServerUrl(input)
      if (!url) return
      updateServerList(url)
    }

    function remove(input: string) {
      const url = normalizeServerUrl(input)
      if (!url) return
      updateServerList(url, true)
    }

    function authHeader(input?: string) {
      const url = normalizeServerUrl(input ?? state.active)
      if (!url) return
      const entry = store.auth[url]
      if (!entry) return
      if (entry.type !== "basic") return
      return `Basic ${btoa(`opencode:${entry.password}`)}`
    }

    createEffect(() => {
      if (!ready()) return
      if (state.active) return
      reconcileStartup()
    })

    createEffect(() => {
      if (typeof window === "undefined") return
      window.__OPENCODE__ ??= {}
      const entry = store.auth[state.active]
      window.__OPENCODE__.serverPassword = entry?.type === "basic" ? entry.password : undefined
    })

    const isReady = createMemo(() => ready() && !!state.active)

    const check = (url: string) => {
      const signal = (AbortSignal as unknown as { timeout?: (ms: number) => AbortSignal }).timeout?.(3000)
      const sdk = createOpencodeClient({
        baseUrl: url,
        fetch: ((input: RequestInfo | URL, init?: RequestInit) => {
          const req = new Request(input, init)
          const auth = authHeader(url)
          if (auth && !req.headers.has("authorization")) req.headers.set("Authorization", auth)
          return (platform.fetch ?? fetch)(req)
        }) as typeof fetch,
        signal,
      })
      return sdk.global
        .health()
        .then((x) => x.data?.healthy === true)
        .catch(() => false)
    }

    createEffect(() => {
      const url = state.active
      if (!url) return

      setState("healthy", undefined)

      let alive = true
      let busy = false

      const run = () => {
        if (busy) return
        busy = true
        void check(url)
          .then((next) => {
            if (!alive) return
            setState("healthy", next)
          })
          .finally(() => {
            busy = false
          })
      }

      run()
      const interval = setInterval(run, HEALTH_POLL_INTERVAL_MS)

      onCleanup(() => {
        alive = false
        clearInterval(interval)
      })
    })

    const origin = createMemo(() => projectsKey(state.active))
    const projectsList = createMemo(() => store.projects[origin()] ?? [])
    const isLocal = createMemo(() => origin() === "local")

    return {
      ready: isReady,
      healthy,
      isLocal,
      get url() {
        return state.active
      },
      get name() {
        return serverDisplayName(state.active)
      },
      get list() {
        return store.list
      },
      setActive,
      add,
      remove,
      auth: {
        get(url?: string) {
          const normalized = normalizeServerUrl(url ?? state.active)
          if (!normalized) return
          return store.auth[normalized]
        },
        setBasic(password: string, url?: string) {
          const normalized = normalizeServerUrl(url ?? state.active)
          if (!normalized) return
          const value = password.trim()
          if (!value) {
            setStore("auth", normalized, undefined!)
            return
          }
          setStore("auth", normalized, {
            type: "basic",
            password: value,
          })
        },
        clear(url?: string) {
          const normalized = normalizeServerUrl(url ?? state.active)
          if (!normalized) return
          setStore("auth", normalized, undefined!)
        },
        header: authHeader,
      },
      projects: {
        list: projectsList,
        open(directory: string) {
          const key = origin()
          if (!key) return
          const current = store.projects[key] ?? []
          if (current.find((x) => x.worktree === directory)) return
          setStore("projects", key, [{ worktree: directory, expanded: true }, ...current])
        },
        close(directory: string) {
          const key = origin()
          if (!key) return
          const current = store.projects[key] ?? []
          setStore(
            "projects",
            key,
            current.filter((x) => x.worktree !== directory),
          )
        },
        expand(directory: string) {
          const key = origin()
          if (!key) return
          const current = store.projects[key] ?? []
          const index = current.findIndex((x) => x.worktree === directory)
          if (index !== -1) setStore("projects", key, index, "expanded", true)
        },
        collapse(directory: string) {
          const key = origin()
          if (!key) return
          const current = store.projects[key] ?? []
          const index = current.findIndex((x) => x.worktree === directory)
          if (index !== -1) setStore("projects", key, index, "expanded", false)
        },
        move(directory: string, toIndex: number) {
          const key = origin()
          if (!key) return
          const current = store.projects[key] ?? []
          const fromIndex = current.findIndex((x) => x.worktree === directory)
          if (fromIndex === -1 || fromIndex === toIndex) return
          const result = [...current]
          const [item] = result.splice(fromIndex, 1)
          result.splice(toIndex, 0, item)
          setStore("projects", key, result)
        },
        last() {
          const key = origin()
          if (!key) return
          return store.lastProject[key]
        },
        touch(directory: string) {
          const key = origin()
          if (!key) return
          setStore("lastProject", key, directory)
        },
      },
    }
  },
})
