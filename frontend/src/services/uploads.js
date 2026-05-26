const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function getUploadUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
}
