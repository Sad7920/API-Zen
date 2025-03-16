import { Trash2 } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const KeyValueForm = ({ param, index, setValue, setKeyFunction, setValueFunction, value }) => {
    return (
        <div className='w-full flex gap-2' key={index}>
            <Input type='text' placeholder='Key' value={param.key} onChange={(e) => setKeyFunction(e, index)} />
            <Input type='text' placeholder='Value' value={param.value} onChange={(e) => setValueFunction(e, index)} />
            <Button variant='outline' className="hover:cursor-pointer" onClick={() => setValue(value.filter((_, i) => i !== index))}>
                <Trash2 />
            </Button>
        </div>
    )
}

export default KeyValueForm