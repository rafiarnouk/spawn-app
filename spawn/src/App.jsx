import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


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
          Get Started
        </Button>
      </div>
    </div>
  )

  const rightsection = (
    <div className="flex-1">
      <img
        src="https://via.placeholder.com/400"
        alt="Hero Image"
        className="w-full h-full object-cover rounded-lg"
      />
    </div>
  )

  return (
    <>
      <div
        className="min-h-screen flex items-center justify-center bg-gray-100"
        style={{
          background: `radial-gradient(circle at 25% 50%, #EFF1FE, #D2D7FF)`,
        }}
      >
        <div className="flex items-center justify-center space-x-8 p-8 max-w-screen-xl">
          {leftsection}
          {rightsection}
        </div>
      </div>
    </>
  )
}

export default App
