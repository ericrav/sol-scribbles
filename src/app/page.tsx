import { Canvas } from './Canvas'
import { Instructions } from './Instructions'

export default function Home() {
  return (
    <main className="h-screen">
      <Instructions />
      <Canvas />
    </main>
  )
}
