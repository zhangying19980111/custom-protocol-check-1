# Custom Protocol Check in Browser

Detect whether a custom protocol is available in browser (Chrome, Firefox, Safari, iOS, IE8-IE11 and Edge)

The implementation is different from one browser to another, sometimes depend on which OS you are. Most of them are hacks, meaning that the solution is not the prettiest.

- Chrome and iOS: using window onBlur to detect whether the focus is stolen from the browser. When the focus is stolen, it assumes that the custom protocol launches external app and therefore it exists.
- Firefox (Version >= 64): using hidden iframe onBlur to detect whether the focus is stolen. When the focus is stolen, it assumes that the custom protocol launches external app and therefore it exists.
- Firefox (Version < 64): try to open the handler in a hidden iframe and catch exception if the custom protocol is not available.
- Safari: using hidden iframe onBlur to detect whether the focus is stolen. When the focus is stolen, it assumes that the custom protocol launches external app and therefore it exists.
- IEs and Edge in Win 8/Win 10: the cleanest solution. IEs and Edge in Windows 8 and Windows 10 does provide an API to check the existence of custom protocol handlers.
- Other IEs: various different implementation. Worth to notice that even the same IE version might have a different behavior (I suspect due to different commit number). It means that for these IEs, the implementation is the least reliable.

# Known Issues

- In some protocol such as "mailto:", IE seems to trigger the fail callback while continuing on opening the protocol just fine (tested in IE11/Win 10). This issue doesn't occur with a custom protocol.

# Special Thanks

custom-protocol-check is forked from https://github.com/ismailhabib/custom-protocol-detection. Many thanks to Ismail Habib Muhammad.

##### Happy Coding! Viresh Shah (http://www.vireshshah.com)
