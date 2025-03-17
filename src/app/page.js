"use client"
import React, { useState } from 'react'
import Navbar from "@/components/Navbar";
import { httpRequestMethods as methods } from '../../constants'
import axios from 'axios';
import prettyBytes from 'pretty-bytes';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup, } from "@/components/ui/resizable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from 'sonner'

import { Button } from "@/components/ui/button";
import KeyValueForm from '@/components/KeyValueForm';

import { updateKeyValue } from '@/lib/utils';

export default function Home() {

  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [jsonBody, setJsonBody] = useState('');
  const [response, setResponse] = useState(null);
  console.log(response);

  // For Query Params
  const handleQueryParamKeyChange = (e, index) => updateKeyValue(e, index, queryParams, setQueryParams, "key");
  const handleQueryParamValueChange = (e, index) => updateKeyValue(e, index, queryParams, setQueryParams, "value");

  // For Headers
  const handleHeaderKeyChange = (e, index) => updateKeyValue(e, index, headers, setHeaders, "key");
  const handleHeaderValueChange = (e, index) => updateKeyValue(e, index, headers, setHeaders, "value");


  const handleRequest = async (e) => {
    e.preventDefault();
    if (!url) toast(<h1 className='text-red-400'>Please enter a valid URL to complete the request.</h1>)

    const params = queryParams.reduce((acc, { key, value }) => (key ? { ...acc, [key]: value } : acc), {});
    const headersObj = headers.reduce((acc, { key, value }) => (key ? { ...acc, [key]: value } : acc), {});

    try {
      const startTime = performance.now();
      const res = await axios({
        url,
        method,
        params,
        headers: headersObj,
        data: jsonBody ? JSON.parse(jsonBody) : undefined,
      });
      const endTime = performance.now();

      setResponse({
        status: res.status,
        time: Math.round(endTime - startTime) + 'ms',
        size: prettyBytes(JSON.stringify(res.data).length + JSON.stringify(res.headers).length),
        body: JSON.stringify(res.data, null, 2),
        headers: res.headers,
      });
    } catch (error) {
      toast(<div className='flex flex-col gap-2'>
        <h1 className='text-red-400'>Error: {error.response?.status || 'Unknown Error'}</h1>
        <pre>{JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
      </div>);
    }
  };

  return (
    <div className="w-full h-screen ">
      <ResizablePanelGroup direction='horizontal' className="p-4 h-full w-full flex gap-x-2">
        {/* LEFT PART */}
        <ResizablePanel className=" h-full w-full p-4 border border-neutral-700  border-dashed flex flex-col gap-y-12 rounded-lg md:min-w-lg">

          {/* NAVBAR */}
          <div className="w-full flex items-center">
            <Navbar />
          </div>

          {/* METHOD SELECTION AND URL INPUT */}

          <div className="w-full p-1  rounded-xl border flex gap-x-2 border-neutral-700 border-dashed">
            <Select value={method} onValueChange={(value) => setMethod(value)}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="METHOD" />
              </SelectTrigger>
              <SelectContent>
                {methods.map((method, idx) => {
                  return <SelectItem key={idx} value={method}>{method}</SelectItem>
                })}
              </SelectContent>
            </Select>
            <input className="w-full h-full focus:outline-hidden" type='text' placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} />
            <Button variant='outline' onClick={handleRequest} className="hover:cursor-pointer">Send</Button>
          </div>

          {/* TABS SECTION */}

          <div className="w-full overflow-y-scroll">
            <Tabs defaultValue="query-params" className="w-full">
              <TabsList className="grid w-full grid-cols-3 ">
                <TabsTrigger value="query-params">Query Params</TabsTrigger>
                <TabsTrigger value="headers">Headers</TabsTrigger>
                <TabsTrigger value="json">JSON</TabsTrigger>
              </TabsList>
              <TabsContent value="query-params" className="max-w-full flex flex-col gap-4 p-4 border border-neutral-700 border-dashed rounded-lg mx-4">
                {queryParams.map((param, index) => (
                  <KeyValueForm
                    key={index}
                    param={param}
                    index={index}
                    onKeyChange={handleQueryParamKeyChange}
                    onValueChange={handleQueryParamValueChange}
                    onRemove={(i) => setQueryParams(queryParams.filter((_, idx) => idx !== i))}
                  />
                ))}
                <Button variant='outline' className="hover:cursor-pointer" onClick={() => setQueryParams([...queryParams, { key: '', value: '' }])}>
                  Add +
                </Button>

              </TabsContent>
              <TabsContent value="headers" className="max-w-full flex flex-col gap-4 p-4 border border-neutral-700 border-dashed rounded-lg mx-4">
                {headers.map((header, index) => (
                  <KeyValueForm
                    key={index}
                    param={header}
                    index={index}
                    onKeyChange={handleHeaderKeyChange}
                    onValueChange={handleHeaderValueChange}
                    onRemove={(i) => setHeaders(headers.filter((_, idx) => idx !== i))}
                  />
                ))}
                <Button variant='outline' className="hover:cursor-pointer" onClick={() => setHeaders([...headers, { key: '', value: '' }])}>
                  Add +
                </Button>

              </TabsContent>
              <TabsContent value="json">
                <div>
                  <h3 className="font-semibold">JSON Body</h3>
                  <textarea value={jsonBody} onChange={(e) => setJsonBody(e.target.value)} placeholder='{\n  \" key\": \"value\"\n}' className="border p-2 w-full h-24" />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* RESPONSE DETAILS */}
          {response && (
            <div className="w-full p-1 justify-around rounded-xl border flex gap-x-2 border-neutral-700 border-dashed">
              <div className='rounded-md px-3 px-1 dark:bg-neutral-800 bg-neutral-200' >Status: <span className='text-green-600 font-medium dark:text-green-400'>{response.status}</span></div>
              <div className='rounded-md px-2 px-1 bg-neutral-800' >Time: <span>{response.time}</span></div>
              <div className='rounded-md px-2 px-1 bg-neutral-800' >Size: <span>{response.size}</span></div>
            </div>
          )}

        </ResizablePanel>
        <ResizableHandle withHandle className="hover:border hover:border-blue-500 my-6" />
        {/* RIGHT PART */}
        <ResizablePanel direction="horizontal" className="h-full w-full p-4 border border-neutral-700 border-dashed  md:min-w-lg rounded-lg">

        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
