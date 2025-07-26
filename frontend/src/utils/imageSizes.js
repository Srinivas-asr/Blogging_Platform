export const getImageSizeClass = (size, isThumbnail = false, returnStyleObject = false) => {
  if (returnStyleObject) {
    // Return style objects instead of class names
    if (isThumbnail) {
      switch (size) {
        case "small":
          return { width: '64px', height: '64px' };
        case "medium":
          return { width: '96px', height: '96px' };
        case "large":
          return { width: '128px', height: '128px' };
        default:
          return { width: '96px', height: '96px' };
      }
    } else {
      switch (size) {
        case "small":
          return { maxWidth: '320px' };
        case "medium":
          return { maxWidth: '448px' };
        case "large":
          return { maxWidth: '512px' };
        default:
          return { maxWidth: '448px' };
      }
    }
  } else {
    // Return class names (original behavior)
    if (isThumbnail) {
      switch (size) {
        case "small":
          return "w-16 h-16";
        case "medium":
          return "w-24 h-24";
        case "large":
          return "w-32 h-32";
        default:
          return "w-24 h-24";
      }
    } else {
      switch (size) {
        case "small":
          return "max-w-xs";
        case "medium":
          return "max-w-md";
        case "large":
          return "max-w-lg";
        default:
          return "max-w-md";
      }
    }
  }
};