import XMLio from 'xmlio'

// str byteToHex(uint8 byte)
//   converts a single byte to a hex string 
function byteToHex(byte: number) {
	const hex = ('0' + byte.toString(16)).slice(-2);
	return hex
}

// str generateId(int len);
//   len - must be an even number (default: 40)
export function generateId(len: number) {
	var arr = new Uint8Array((len || 40) / 2);
	window.crypto.getRandomValues(arr);
	const tail = [].map.call(arr, byteToHex).join("");
	const head = String.fromCharCode(97 + Math.floor(Math.random() * 26))
	return `${head}${tail}`
}

export function fetchXML(url: string): Promise<XMLio> {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest
		xhr.open('GET', url)
		xhr.responseType = 'document'
		xhr.overrideMimeType('text/xml')

		xhr.onload = function() {
			if (xhr.readyState === xhr.DONE && xhr.status === 200) {
				if (xhr.responseXML == null) {
					reject('Fetching XML failed')
					return
				}
				const xmlio = new XMLio(xhr.responseXML)
				resolve(xmlio)
			}
		}

		xhr.send()
	})
}
