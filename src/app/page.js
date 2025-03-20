"use client"
import React, { useEffect, useState } from 'react'
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
import { highlight } from '@/lib/shared';

import ReactCodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json'
import { dracula } from '@uiw/codemirror-theme-dracula'
import { githubLight } from '@uiw/codemirror-theme-github'
import { Rocket } from 'lucide-react';
import Footer from '@/components/Footer';

export default function Home() {


  const [method, setMethod] = useState('GET')
  const [url, setUrl] = useState('')
  const [queryParams, setQueryParams] = useState([{ key: '', value: '' }]);
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [jsonBody, setJsonBody] = useState('{\n  \"key\": \"value\"\n}');

  const [response, setResponse] = useState(null);
  const [highlightedResponse, setHighlightedResponse] = useState(null)
  const [responseHeaders, setResponseHeaders] = useState({})

  const [theme, setTheme] = useState('')
  console.log(response);

  // For Query Params
  const handleQueryParamKeyChange = (e, index) => updateKeyValue(e, index, queryParams, setQueryParams, "key");
  const handleQueryParamValueChange = (e, index) => updateKeyValue(e, index, queryParams, setQueryParams, "value");

  // For Headers
  const handleHeaderKeyChange = (e, index) => updateKeyValue(e, index, headers, setHeaders, "key");
  const handleHeaderValueChange = (e, index) => updateKeyValue(e, index, headers, setHeaders, "value");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "dark" : "light");

    // Listen for changes in system theme
    const handleThemeChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);


  const handleRequest = async (e) => {
    e.preventDefault();
    if (!url || !method) {
      toast(<h1 className='text-red-400'>Please enter a valid URL to complete the request.</h1>)
      return
    }

    const params = queryParams.reduce((acc, { key, value }) => (key ? { ...acc, [key]: value } : acc), {});
    const headersObj = headers.reduce((acc, { key, value }) => (key ? { ...acc, [key]: value } : acc), {});

    try {
      const startTime = performance.now();
      const res = await axios({
        url,
        method,
        params,
        headers: headersObj,
        data: jsonBody !== '{\n  \"key\": \"value\"\n}' && jsonBody ? JSON.parse(jsonBody) : undefined,
      });
      const endTime = performance.now();

      const responseData = {
        status: res.status,
        time: Math.round(endTime - startTime) + 'ms',
        size: prettyBytes(JSON.stringify(res.data).length + JSON.stringify(res.headers).length),
        body: JSON.stringify(res.data, null, 2),
        headers: res.headers,
      };
      setResponse(responseData);
      setResponseHeaders({
        cacheControl: responseData.headers.get('cache-control'),
        contentType: responseData.headers.get('content-type'),
        expires: responseData.headers.get('expires'),
        pragma: responseData.headers.get('pragma'),
      })
      const highlightedData = await highlight(responseData.body, 'json')
      setHighlightedResponse(highlightedData)
    } catch (error) {
      console.log(error);
      toast(<div className='flex flex-col gap-2'>
        <h1 className='text-red-400'>Error: {error.response?.status || 'Unknown Error'}</h1>
        <pre>{JSON.stringify(error.response?.data || error.message, null, 2)}</pre>
      </div>);
    }
  };

  console.log(response);

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
              <TabsContent value="json" className="mx-4">
                <div className="h-full overflow-auto rounded-md ">
                  <ReactCodeMirror
                    value={jsonBody}
                    extensions={[json()]}  // Use `extensions` instead of `mode`
                    theme={theme == 'dark' ? dracula : githubLight}  // Pass `theme` as a direct prop
                    onChange={(value) => setJsonBody(value)}
                    basicSetup={{ lineNumbers: true }}  // Enable line numbers properly
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* RESPONSE DETAILS */}
          {response && (
            <div className="w-full p-1 justify-around rounded-xl border flex gap-x-2 border-neutral-700 border-dashed">
              <h1 className='rounded-md px-3 py-1 dark:bg-neutral-800 bg-neutral-200' >Status: <span className='text-green-600 font-medium dark:text-green-400'>{response.status}</span></h1>
              <h1 className='rounded-md px-2 py-1 dark:bg-neutral-800 bg-neutral-200' >Time: <span>{response.time}</span></h1>
              <h1 className='rounded-md px-2 py-1 dark:bg-neutral-800 dark:bg-neutral-800 bg-neutral-200' >Size: <span>{response.size}</span></h1>
            </div>
          )}
          <Footer />
        </ResizablePanel>
        <ResizableHandle withHandle className="hover:border hover:border-blue-500 my-6" />


        {/* RIGHT PART */}
        <ResizablePanel direction="horizontal" className="h-full w-full p-4 border border-neutral-700 border-dashed  md:min-w-lg rounded-lg">
          <Tabs defaultValue="body" className="w-full max-h-full">
            <TabsList className="grid w-full grid-cols-2 ">
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
            </TabsList>
            {highlightedResponse ?
              (
                <TabsContent
                  value="body"
                  className="flex flex-col gap-4 p-1 border border-neutral-700 border-dashed mb-5 z-10 rounded-lg mx-4 h-full overflow-hidden"
                >
                  <div className="flex-1 h-full overflow-auto  rounded-sm">
                    <pre className="text-sm overflow-auto rounded-sm text-wrap">
                      {highlightedResponse[theme]}
                    </pre>
                  </div>
                </TabsContent>
              ) : (<TabsContent
                value="body"
                className="flex flex-col h-full gap-4 px-4 py-10 text-neutral-500 dark:text-neutral-300 text-center justify-center  items-center border border-neutral-700 border-dashed  rounded-lg mx-4 h-fit"
              >
                <Rocket size={60} />
                <p>Click send to get a response</p>
              </TabsContent>)
            }

            <TabsContent value="headers" className="max-w-full flex flex-col  p-4 border border-neutral-700 border-dashed rounded-lg mx-4">
              {responseHeaders && (<div className='w-full grid grid-cols-1 gap-4'>
                <div className='rounded-md px-2 py-1 dark:bg-neutral-800 bg-neutral-200' >Cache-control: <span className='text-blue-400'>{responseHeaders.cacheControl}</span></div>
                <div className='rounded-md px-2 py-1  dark:bg-neutral-800 bg-neutral-200' >Content-type: <span className='text-blue-400'>{responseHeaders.contentType}</span></div>
                <div className='rounded-md px-2 py-1  dark:bg-neutral-800 bg-neutral-200' >Expires: <span className='text-blue-400'>{responseHeaders.expires}</span></div>
                <div className='rounded-md px-2 py-1  dark:bg-neutral-800 bg-neutral-200' >Pragma: <span className='text-blue-400'>{responseHeaders.pragma}</span></div>
              </div>)}
              <div className='w-full'>
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
