import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import ThreeJsRenderer  from "./ThreeJsRenderer";


function App() {
  return (
    <div className="container">
      <div className="flex flex-col items-center gap-5">
        <h1 className="text-3xl font-bold underline">Voxel Three</h1>
        <ThreeJsRenderer />
      </div>
    </div>
  )
}

export default App
