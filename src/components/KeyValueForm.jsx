import { Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const KeyValueForm = ({ param, index, onKeyChange, onValueChange, onRemove }) => {
    return (
        <div className="w-full flex gap-2">
            <Input type="text" placeholder="Key" value={param.key} onChange={(e) => onKeyChange(e, index)} />
            <Input type="text" placeholder="Value" value={param.value} onChange={(e) => onValueChange(e, index)} />
            <Button variant="outline" className="hover:cursor-pointer" onClick={() => onRemove(index)}>
                <Trash2 />
            </Button>
        </div>
    );
};

export default KeyValueForm;
