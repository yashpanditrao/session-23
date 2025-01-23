import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

function LinksTable() {
  const [links, setLinks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    async function fetchLinks() {
      const { data, error } = await supabase
        .from('links')
        .select('link, summary, id')
      
      if (error) {
        console.error('Error fetching links:', error)
      } else {
        console.log('Links data:', data)
        setLinks(data)
        console.log(links)
      }
    }

    fetchLinks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          k: 2
        })
      })
      const data = await response.json()
      console.log('Search response:', data)
      
      // Filter links based on returned IDs
      const filteredResults = links.filter(link => data.matches.includes(link.id))
      setSearchResults(filteredResults)
      setShowPopup(true)
    } catch (error) {
      console.error('Error searching:', error)
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 px-3 py-2 border rounded-md text-black"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* Search Results Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Search Results</h2>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Link</TableHead>
                    <TableHead>Summary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <a href={item.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                          {item.link}
                        </a>
                      </TableCell>
                      <TableCell>{item.summary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {searchResults.length === 0 && (
                <p className="text-center text-gray-500 py-4">No results found</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Link</TableHead>
              <TableHead>Summary</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <a href={item.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    {item.link}
                  </a>
                </TableCell>
                <TableCell>{item.summary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default LinksTable
