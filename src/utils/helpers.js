/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML
 */
export function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Parse S3 XML list response
 * @param {string} xmlText - XML response from S3
 * @returns {Array} Array of objects
 */
export function parseS3ListResponse(xmlText) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const contents = xmlDoc.getElementsByTagName('Contents');
    const objects = [];

    for (let i = 0; i < contents.length; i++) {
        const keyElement = contents[i].getElementsByTagName('Key')[0];
        const sizeElement = contents[i].getElementsByTagName('Size')[0];
        const lastModifiedElement = contents[i].getElementsByTagName('LastModified')[0];

        if (keyElement && keyElement.textContent) {
            objects.push({
                Key: keyElement.textContent,
                Size: sizeElement ? parseInt(sizeElement.textContent) : 0,
                LastModified: lastModifiedElement ? new Date(lastModifiedElement.textContent) : null,
            });
        }
    }

    return objects;
}
