let qr;

async function shortenUrl() {
    const longUrl = document.getElementById('longUrl').value;
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');

    if (!longUrl) {
        showNotification('Please enter a URL', 'error');
        return;
    }

    if (!isValidUrl(longUrl)) {
        showNotification('Please enter a valid URL', 'error');
        return;
    }

    loading.classList.add('active');
    result.classList.remove('active');

    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const shortUrl = await response.text();
        document.getElementById('shortUrl').textContent = shortUrl;
        result.classList.add('active');
        showNotification('URL shortened successfully!', 'success');
    } catch (error) {
        showNotification('Error shortening URL. Please try again.', 'error');
    } finally {
        loading.classList.remove('active');
    }
}

function copyUrl() {
    const shortUrl = document.getElementById('shortUrl').textContent;
    navigator.clipboard.writeText(shortUrl)
        .then(() => showNotification('URL copied to clipboard!', 'success'))
        .catch(() => showNotification('Failed to copy URL', 'error'));
}

function generateQR() {
    const text = document.getElementById('text').value;
    if (!text) {
        showNotification('Please enter text or URL', 'error');
        return;
    }

    const qrcodeDiv = document.getElementById('qrcode');
    qrcodeDiv.innerHTML = '';

    qr = new QRCode(qrcodeDiv, {
        text: text,
        width: 256,
        height: 256,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    document.getElementById('downloadBtn').classList.add('show');
}

function downloadQR() {
    const img = document.querySelector('#qrcode img');
    if (!img) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = img.src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function updateCharCount() {
    const text = document.getElementById('textInput').value;
    document.getElementById('charCount').textContent = `Characters: ${text.length}`;
}

function convertCase(type) {
    const input = document.getElementById('textInput');
    const text = input.value;

    if (!text) {
        showNotification('Please enter text to convert', 'error');
        return;
    }

    switch (type) {
        case 'upper':
            input.value = text.toUpperCase();
            break;
        case 'lower':
            input.value = text.toLowerCase();
            break;
        case 'title':
            input.value = text.toLowerCase().replace(/(?:^|\s)\w/g, letter => letter.toUpperCase());
            break;
        case 'sentence':
            input.value = text.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter => letter.toUpperCase());
            break;
    }
    showNotification('Text converted successfully!', 'success');
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: clamp(0.75rem, 2vw, 1rem);
                border-radius: 6px;
                color: white;
                background: ${type === 'error' ? '#dc3545' : '#28a745'};
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 1000;
                animation: slideIn 0.3s ease-out;
                font-size: clamp(0.875rem, 2vw, 1rem);
                max-width: 90vw;
            `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}
