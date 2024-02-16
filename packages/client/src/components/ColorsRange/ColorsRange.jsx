import {useRef, useState, useEffect} from 'react';
import "./ColorsRange.scss"

export default function ColorsRange({onSelectColor}) {

    useEffect(() => {
        console.log('ColorsRange component is mounted');

    }, []);

    const availableHexaColors = [
        {
            label: 'black',
            hexaColor: '#000000'
        },
        {
            label: 'white',
            hexaColor: '#ffffff'
        },
        {
            label: 'red',
            hexaColor: '#ff0000'
        },
        {
            label: 'green',
            hexaColor: '#00ff00'
        },
        {
            label: 'blue',
            hexaColor: '#0000ff'
        },
        {
            label: 'yellow',
            hexaColor: '#ffff00'
        },
        {
            label: 'cyan',
            hexaColor: '#00ffff'
        },
        {
            label: 'magenta',
            hexaColor: '#ff00ff'
        },
        {
            label: 'silver',
            hexaColor: '#c0c0c0'
        },
        {
            label: 'gray',
            hexaColor: '#808080'
        },
        {
            label: 'maroon',
            hexaColor: '#800000'
        },
        {
            label: 'olive',
            hexaColor: '#808000'
        },
        {
            label: 'purple',
            hexaColor: '#800080'
        },
        {
            label: 'teal',
            hexaColor: '#008080'
        },
        {
            label: 'navy',
            hexaColor: '#000080'
        }
    ];

    const handleColorChange = (color) => {
        onSelectColor(color); // Appeler la fonction de gestion de l'état avec la couleur sélectionnée
    };


    return (
        <div className={''}>
            {availableHexaColors.map(((color, index) => (
                <div key={index}>
                    <div onClick={() => handleColorChange(color.hexaColor)} className={'color-legend'}
                         style={{backgroundColor: color.hexaColor}}></div>
                </div>
            )))}
        </div>
    );
}
