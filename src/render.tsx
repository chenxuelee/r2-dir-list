const  cleanTitle = (path: string) => {
    var parts = path.split("/")
    // remove the empty strings
    parts = parts.filter((part) => part !== "")
    return parts[parts.length - 1]
  }
  
  
  
  const  cleanFileName = (name: string) => {
    return name.split("/").slice(-1).pop()!
  }
  
  const  cleanFolderName = (name: string) => {
    return name.slice(0, -1).split("/").slice(-1).pop()!
  }
  
  // taken from https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
  const humanFileSize = (bytes: number, si = false, dp = 1) => {
    const thresh = si ? 1000 : 1024;
  
    if (Math.abs(bytes) < thresh) {
      return bytes + ' B';
    }
  
    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;
  
    do {
      bytes /= thresh;
      ++u;
    } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);
  
  
    return bytes.toFixed(dp) + ' ' + units[u];
  }

  
  export { humanFileSize,cleanFileName,cleanTitle,cleanFolderName }