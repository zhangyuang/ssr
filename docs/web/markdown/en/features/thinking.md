# Design Philosophy

This chapter shares some of the design thinking of this framework to help developers better understand the design purpose and principles. Since code is constantly changing, if the image content in this chapter is not the latest, you can submit an `issue` for feedback and updates. We welcome other frameworks to reference our thinking, but please indicate the source. If you think there are areas for design improvement without affecting existing functionality and upper-level business code, please submit an `issue` for discussion.

## Plugin-Based Design

Plugins are divided into frontend plugins and server-side plugins, with the main logic in frontend plugins.

### Frontend Plugins

![](/images/plugin1.png)

### Overall Design

![](/images/plugin2.png)

## Render Degradation

How to implement a mature degradation functionality.

### When to Perform Degradation

![](/images/csr1.png)

![](/images/csr2.png)

### How Industry Common Solutions Work

Usually, when errors occur, requests are routed to a static `html` file to achieve this.

![](/images/csr3.png)

![](/images/csr4.png)

### How We Do It

![](/images/csr5.png)

![](/images/csr6.png)

## How Asynchronous Chunks Are Collected and Preloaded

### Why There Are Asynchronous Chunks

![](/images/chunk1.png)

### How vue-renderer Does It

![](/images/chunk2.png)

### How We Do It

![](/images/chunk3.png)

### What Are the Advantages

![](/images/chunk4.png)
