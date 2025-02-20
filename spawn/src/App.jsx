import { useState } from 'react'
import { Button } from "@/components/ui/button"


function App() {
  const leftsection = (
    <div className="flex-1 text-left">
      <h1 className="text-6xl font-extrabold text-gray-900">
        Get notified for our beta release.
      </h1>
      <p className="mt-4 text-lg text-gray-700">
        Make every impromptu plan effortless. Stay in the loop and be the first to try Spawn when we go live! ⭐ 
      </p>
      <Button className="mt-6 rounded-full p-6">
        Get Started
      </Button>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center justify-center space-x-8 p-8 max-w-screen-xl">
          {leftsection}
          {rightsection}
        </div>
      </div>
    </>
  )
}

export default App
