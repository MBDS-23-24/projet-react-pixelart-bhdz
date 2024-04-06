import "./ColorsRange.scss"

export default function ColorsRange({onSelectColor}) {

    const availableHexaColors = [
        {
            label: 'black',
            hexaColor: '#000000'
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
        }
    ];

    const handleColorChange = (color) => {
        onSelectColor(color); // Appeler la fonction de gestion de l'état avec la couleur sélectionnée
    };


    return (
        <div className={'color-range'}>
            {availableHexaColors.map(((color, index) => (
                <div key={index} onClick={() => handleColorChange(color.hexaColor)} className={'color-legend'}
                     style={{backgroundColor: color.hexaColor}}></div>
            )))}
        </div>
    );
}
