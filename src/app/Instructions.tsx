'use client';

import { useEffect, useState } from 'react';

export function Instructions() {
  const [begin, setBegin] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    // get text from url search params
    const url = new URL(window.location.href);
    const text = url.searchParams.get('text');
    if (text) setText(text);
  }, [])

  useEffect(() => {
    // add text to url search params
    const url = new URL(window.location.href);
    url.searchParams.set('text', text);
    window.history.replaceState({}, '', url.toString());
  }, [text])

  if (begin) return (
    <div className='fixed top-2 left-2 z-50'>
      <button
        type='button'
        className='p-3 border-4 text-[#efeeee] bg-black text-sm shadow-sm'
        onClick={() => setBegin(false)}
      >
        instructions
      </button>
    </div>
  );

  return (
    <div className='absolute inset-0 z-50 flex justify-center items-center bg-[#efeeee]/75'>
      <div className='p-4 bg-black text-[#efeeee] shadow-lg text-center min-w-[450px] min-h-[600px] flex flex-col'>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className='p-2 h-full flex-grow outline-none bg-transparent text-[#efeeee] text-lg font-[inherit] text-center resize-none'
          placeholder='write your instructions'
        />

        <button
          type='button'
          className='p-4 border-4 border-[#efeeee] hover:bg-[#efeeee] text-[#efeeee] hover:text-black text-lg font-bold'
          onClick={() => setBegin(true)}
        >
          begin
        </button>
      </div>
    </div>
  );
}
