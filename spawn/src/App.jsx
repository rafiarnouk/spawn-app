import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import logo from "./assets/spawnlogo.png"
import events from "./assets/eventsgraphic.png"


function App() {
  const leftsection = (
    <div className="flex-1 text-left">
      <h1 className="text-6xl font-extrabold text-gray-900">
        Get notified for our <span className="text-spawn-purple">beta release.</span>
      </h1>
      <p className="mt-6 text-lg text-gray-700">
        Make every impromptu plan effortless. Stay in the loop and be the first to try <span className="text-spawn-purple">Spawn</span> when we go live! ⭐
      </p>
      <div className="flex justify-center items-center space-x-4 mt-6">
        <Input
          className="mt-6 bg-white rounded-full p-6"
          type="email"
          placeholder="Email address..."
        />
        <Button className="mt-6 rounded-full p-6">
          Notify Me
        </Button>
      </div>
    </div>
  )

  const rightsection = (
    <div className="flex-1">
      <img
        src={events}
        alt="Events Graphic"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  )

  const navbar = (
    <div className="py-4">
      <div className="flex justify-center">
        <img
          src={logo} // The imported image path
          alt="Logo"
          className="h-10"
        />
      </div>
    </div>
  )

  const bggrad = {
    background: `radial-gradient(circle at 25% 50%, #EFF1FE, #D2D7FF)`,
  }

  return (
    <>
      <div style={bggrad}>
        {navbar}
        <div className="min-h-screen flex items-center justify-center pb-12">
          <div className="flex items-center justify-center space-x-20 p-8 max-w-screen-xl">
            {leftsection}
            {rightsection}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
