import React from 'react'

export default function DirPanel({goBack,refresh}) {
    return (
        <div style={{float:"right"}}>
            <button onClick={goBack}>⮝</button>
            <button onClick={refresh}>🗘</button>
        </div>
    )
}
