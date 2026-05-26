const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export function getUploadUrl(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Serve files via API endpoint instead of static handler
    // /uploads/imagens/xxx.jpg -> /api/files/imagens/xxx.jpg
    const apiPath = path.replace('/uploads/', '/api/files/');
    return `${API_URL}${apiPath}`;
}
