// One command for local work: `npm run dev` from the repo root.
// Starts the API (4000), the CMS (5174) and the website (5173) together.
// Ctrl+C stops all three.
import { execFile, spawn } from "node:child_process"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const env = {
  ...process.env,
  PATH: `/opt/homebrew/opt/node@22/bin:/opt/homebrew/bin:${process.env.PATH ?? ""}`,
}

// The Mac launch agents keep these ports and would restart under us. Hand the ports to this command.
if (process.platform === "darwin" && process.getuid) {
  const target = `gui/${process.getuid()}`
  for (const name of ["api", "web", "site"]) {
    await new Promise((done) => {
      execFile("launchctl", ["bootout", `${target}/local.omi-jaffna.${name}`], () => done())
    })
  }
}

const services = [
  { name: "api", color: "\x1b[34m", cwd: "api", args: ["run", "dev"] },
  { name: "cms", color: "\x1b[35m", cwd: "web", args: ["run", "dev"] },
  { name: "site", color: "\x1b[32m", cwd: "site", args: ["run", "dev", "--", "--hostname", "localhost", "--port", "5173"] },
]

const children = []
let stopping = false

function stopAll() {
  if (stopping) return
  stopping = true
  for (const child of children) child.kill("SIGTERM")
  setTimeout(() => {
    for (const child of children) child.kill("SIGKILL")
    process.exit(0)
  }, 1500).unref()
}

function pipe(child, name, color) {
  const write = (chunk) => {
    for (const line of chunk.toString().split(/\r?\n/)) {
      if (line) process.stdout.write(`${color}[${name}]\x1b[0m ${line}\n`)
    }
  }
  child.stdout.on("data", write)
  child.stderr.on("data", write)
}

for (const service of services) {
  const child = spawn("npm", service.args, {
    cwd: path.join(root, service.cwd),
    env,
    stdio: ["ignore", "pipe", "pipe"],
  })
  children.push(child)
  pipe(child, service.name, service.color)
  child.on("exit", (code, signal) => {
    if (stopping) return
    process.stderr.write(`[${service.name}] stopped (${signal ?? code}). Stopping the others.\n`)
    stopAll()
  })
}

process.stdout.write("Starting API http://localhost:4000, CMS http://localhost:5174, website http://localhost:5173 (CMS in the site at /admin). Ctrl+C stops all.\n")
process.on("SIGINT", stopAll)
process.on("SIGTERM", stopAll)
