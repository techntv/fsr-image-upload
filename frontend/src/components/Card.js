// front-end/scr/components/Card.js

import React from 'react'

const Card = ({ file }) => {
  return (
    <>
      <div className='max-w-sm rounded overflow-hidden shadow-lg border-2'>
        <iframe
          style={{ height: '20rem' }}
          className='w-full'
          src={file.filePath}
          title={file.name}
        ></iframe>
        <div className='px-6 py-4'>
          <div className='font-bold text-xl mb-2'>{file.name}</div>
          <p className='text-gray-700 text-base'>{file.description}</p>
        </div>
      </div>
    </>
  )
}

export default Card
