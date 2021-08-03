/*! (C) Copyright 2020 LanguageTooler GmbH. All rights reserved. */
{
    const e = (window.chrome || window.browser).runtime;
    (e.getManifest().content_scripts || []).forEach((t) => {
        t.js &&
            t.all_frames &&
            t.css &&
                t.css.forEach((t) => {
                    const c = document.createElement("link");
                    (c.rel = "stylesheet"), (c.href = e.getURL(t)), document.head.appendChild(c);
                });
    });
}
