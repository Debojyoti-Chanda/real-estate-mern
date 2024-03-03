import React from 'react'

const Search = () => {
  return (
      <div className='flex flex-col sm:flex-row sm:min-h-screen'>
          <div className="m-7 border-b-2 sm:border-r-2 sm:border-b-0 p-4">
              <form className='flex flex-col gap-5 justify-center items-center'>
                  <div className=' flex flex-row  items-center gap-2'>
                      <label htmlFor='searchTerm' className=' whitespace-nowrap font-semibold'>Search Term</label>
                      <input type='text' id='searchTerm' name='searchTerm' placeholder='Search...' className=' border rounded-xl p-3 w-full '/>
                  </div>
                  <div className='flex gap-2 flex-wrap items-center'>
                      <label className=' font-semibold'>Type:</label>
                      <div className='flex gap-2'>
                          <input type='checkbox' id='rent' />
                          <span>Rent</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type='checkbox' id='sale' className=' font-semibold'/>
                          <span>Sale</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type='checkbox' id='offer' className=' font-semibold'/>
                          <span>Offer</span>
                      </div>
                  </div>
                  <div className='flex gap-2 flex-wrap items-center'>
                      <label className=' font-semibold'>Amenities:</label>
                      <div className='flex gap-2'>
                          <input type='checkbox' id='parking'/>
                          <span>Parking</span>
                      </div>
                      <div className='flex gap-2'>
                          <input type='checkbox' id='furnished'/>
                          <span>Furnished</span>
                      </div>
                  </div>
                  <div className='flex gap-2 items-center'>
                      <label className=' font-semibold'>Sort</label>
                      <select id='sort_order' className='border rounded-xl p-3 bg-slate-400 text-white'>
                          <option>Price High to Low</option>
                          <option>Price Low to High</option>
                          <option>Latest</option>
                          <option>Oldest</option>
                      </select>
                  </div>
                  <button className=' bg-slate-500 text-white p-3 rounded-2xl uppercase hover:opacity-85 w-28'>Search</button>
              </form>
          </div>
          <div className="className">
              <h1 className='text-3xl font-semibold border-b p-3 text-slate-500 mt-5'>Listing Results</h1>

          </div>
    </div>
  )
}

export default Search