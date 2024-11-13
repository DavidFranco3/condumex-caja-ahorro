export function convertToText(jsonData) {
    return JSON.stringify(jsonData, null, 2);
}

export function downloadText(textData, fileName) {
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8;' });

    // Crear un enlace temporal para descargar el archivo
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
