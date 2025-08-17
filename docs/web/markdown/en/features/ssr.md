# What is Server-Side Rendering

Although I believe developers who choose the `ssr` framework already have a general understanding of what server-side rendering is, it's still necessary to provide a detailed introduction to server-side rendering and what isomorphic server-side rendering is.

`Note: This framework supports both server-side rendering and client-side rendering modes. If developers don't need to use server-side rendering mode, they can switch rendering modes at any time.`

## Isomorphic Development

Isomorphic development in the frontend context refers to using the same code to support running on both server-side and client-side simultaneously. Different from traditional `JSP/ASP` and `template + data` => `html` + frontend `jQuery`, native `JS` DOM manipulation and event binding server-side rendering methods, which we call frontend-backend heterogeneous, isomorphic rendering refers to the process where components can run on the server-side to generate `html`, which is then taken over by client-side `Vue/React` from the server-rendered html, transforming it into dynamic `DOM` managed by client-side Vue/React.

### Evolution Process

Let's look at the evolution process of frontend development:

1. The initial era of pure server-side rendering in Java and PHP times
2. Frontend-backend separation, using JavaScript running on the client-side, obtaining server-side interface data through requests, leveraging frontend frameworks like jQuery, Angular, React, Vue to manipulate or generate page `DOM`, fully utilizing client-side resources, reducing server-side pressure, with clear frontend-backend division of responsibilities, which remains the most commonly used development approach today.
3. Isomorphic development, such as `Next.js`, `Nuxt.js` frameworks and the `ssr` framework introduced in this documentation, all provide different applicable scenarios and development approaches, but the goal is to enable the same codebase to be applied to both server-side and client-side.

SSR Evolution Process:

1. JSP/ASP/Smarty all count, and of course Node template rendering also counts. The Node world has the richest templates

2. bigpipe, although old, the advantages of chunked transmission are very obvious and browser-friendly. Facebook, Weibo, and Qunar are all beneficiaries. Node natively supports it, res.write is very friendly

3. Component-based SSR writing, such as `React SSR`, `Vue SSR`. Times have changed, `SSR` must keep up. `vdom + hydrate` can be combined very comfortably

4. True isomorphism, where CSR and SSR writing is consistent, no longer distinguishing concepts in the future. In `serverless`, both API and rendering are functions.

The changes in frontend technology in recent years have been earth-shaking. Before choosing a technology stack, you should clearly see your application scenarios. There is no best framework, only the framework most suitable for application scenarios. Isomorphic development is no exception. Let's introduce the advantages of using isomorphic development and issues that need attention:

### Considerations for Isomorphic Development

Frontend-backend isomorphic server-side rendering requires higher mental demands from frontend developers. Developers can no longer develop server-side rendering applications with traditional `spa` application development thinking. But whether you use server-side rendering or not, knowing the differences between them can help you become more professional. Don't let yourself be just a page engineer.

- Code or framework level needs to be compatible with server/client runtime

A more direct example is `fetch` data operations. If the server-side data source has `rpc` protocol or the requested service has environment/network isolation, the client-side cannot obtain data at this time. `You need to encapsulate rpc or requests with environment/network isolation into general http interfaces`, or some frontend libraries cannot run on the backend. These issues need special handling.

- More complex deployment and packaging builds

Deployment and packaging build processes are doubled. Simply understood, it's the sum of separate server and separate client work. However, this problem has been largely smoothed out in the `ssr` framework, exposing simpler configurations to developers with higher customizability, while providing one-click packaging and build deployment commands.

- Increased server-side load

This "disadvantage" is strictly a common problem of traditional SSR, but after using isomorphic development methods, it can completely become an optimizable point. When using isomorphic methods, you can monitor server-side resource load. If you encounter excessive server-side load or peak periods, you can seamlessly switch the rendering method to CSR, and switch back to SSR when server-side load returns to normal or traffic subsides.

### Advantages of Isomorphic Development

- Server-side and client-side share code

- Faster page content arrival time

- More SEO-friendly

- More elegant degradation methods, more robust applications

The above advantages integrate the advantages of both SSR and CSR rendering methods. When developers choose this solution, they should still consider clearly whether they definitely need to use this method and weigh the pros and cons of this solution. Evaluate whether SEO and content arrival time are crucial to the application.
