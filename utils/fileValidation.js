export const validateSize = (file) => {
    if (!file) return
    if (file.size > 5000000) {
        return true
    } else {
        return false
    }
}

const getExtension = (filename) => {
    var parts = filename.split('.');
    return parts[parts.length - 1];
}

export const isVideo = (filename) => {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'm4v':
        case 'avi':
        case 'mpg':
        case 'mp4':
        case 'webm':
            return true;
    }
    return false;
}

export const isImage = (filename) => {
    var ext = getExtension(filename);
    switch (ext.toLowerCase()) {
        case 'jpg':
        case 'gif':
        case 'bmp':
        case 'png':
        case 'jpeg':
            return true;
    }
    return false;
}