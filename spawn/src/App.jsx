"use client"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import logo from "./assets/spawnlogo.png"
import events from "./assets/eventsgraphic.png"

function App() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(true)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const dto = {
      email,
      hasSubscribedToNewsletter: isSubscribed,
    }

    try {
      const response = await fetch('/postRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dto),
      })

      if (response.ok) {
        alert('Successfully signed up!')
      } else {
        alert('Failed to sign up. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const leftsection = (
    <div className="flex-1 text-left">
      <h1 className="text-6xl font-extrabold text-gray-900">
        Get notified for our <span className="text-spawn-purple">beta release.</span>
      </h1>
      <p className="mt-6 text-lg text-gray-700">
        Make every impromptu plan effortless. Stay in the loop and be the first to try <span className="text-spawn-purple">Spawn</span> when we go live! ⭐
      </p>
      <form onSubmit={handleSubmit} className="flex justify-center items-center space-x-4 mt-10">
        <Input
          className="bg-white rounded-full p-6"
          type="email"
          placeholder="Email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button className="rounded-full p-6" type="submit">
          Notify Me
        </Button>
      </form>
      <div className="flex items-center mt-6 space-x-2">
        <Checkbox
          className="rounded-md"
          id="newsletter"
          checked={isSubscribed}
          onChange={(e) => setIsSubscribed(e.target.checked)}
        />
        <label
          htmlFor="newsletter"
          className="text-sm text-gray-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Subscribe to our newsletter and get exclusive updates on Spawn!
        </label>
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
    background: `radial-gradient(circle at 25% 50%, #EFF1FE, #C0C7FF)`,
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
