The objective of this repository is to learn about the serverless architecture. I am doing this by writing a guide to serverless and building a URL shortener using Google Cloud functions. This repo is a continued work-in-progress as I learn more about serverless. The current URL shortener, which I label as a "URL converter" as I don't currently own a custom domain to ensure the shortened url is shorter than the original, is hosted at https://cloud-function-tutorial-58f26.web.app/ .

# What is Serverless?

Serverless computing, or simply _Serverless_, refers to a model of backend architecture where developers build and run services without managing the underlying infrastructure. In a serverless model, it is not the case that there are no servers but that the developer does not manage the servers. Under the umbrella term of _Serverless_, there are two similar but different models for creating the services that run backend functionality.

1.  “Backend as a Service” or “BaaS” refers to cloud-hosted services that developers can use for much, if not all, of their backend functionality. BaaS providers offer services that provide capabilities such as database management, cloud storage, user authentication, and hosting. Services such as AWS S3 and Firebase Realtime Database are examples of services offered by BaaS providers. While some work needs to be done by the developer to configure BaaS services, much of the work is taken care of by the provider.
2.  “Functions as a Service'', or “FaaS'' refer to platforms that allow developers to write code to create functions that run on third-party cloud-hosted servers. AWS Lambda, Google Cloud Functions, and Azure Serverless Compute are examples of FaaS services. These services are often used when developing a microservice backend architecture.

This repo will focus on FaaS, as this is the area of serverless computing that is newer and (in my experience) is what many people refer to when using the term _Serverless_.

## More about Functions

Functions are the center of FaaS. Functions are ephemeral, event-driven, stateless, and require zero administration before or after they are deployed. I will look at each of these characteristics more to understand the effect they have on FaaS development.

### Ephemeral

While you only have to deploy your function to a service such as AWS Lambda once, each time the function is run, the FaaS provider has to take some time to create an instance of the function. The time it takes to instantiate a function can take anywhere from a few milliseconds to a few seconds and depends on a multitude of variables. Instances of functions are only kept around for a few minutes before being discarded by the provider if they are not invoked. This results in the “cold start” issue, which I will discuss more in the _Cons_ section. It should also be noted that FaaS services limit how long each function is allowed to run. As a result, functions must be small and are not suited to perform one or more long-duration tasks.

### Event-driven

Functions are usually triggered by event types determined by the provider or by an HTTP request. The ​​[Firebase Cloud Function](https://firebase.google.com/docs/functions/use-cases) docs outline a number of ways events can trigger cloud functions. For example, when an image is uploaded to Google Cloud Storage, a function that modifies it and re-uploads it to storage can be triggered.

### Stateless

State in cloud functions is not persisted across function invocations. If you have a function that needs to access state across function calls, this state needs to be stored outside of the FaaS function instance (perhaps in a database).

## Pros of Serverless Functions

### Serverless Can Save You Money

With FaaS, you are only paying when your functions run. You aren’t paying for servers that are idle and waiting for requests. In FaaS, horizontal scaling is flexible and completely managed by the provider. If your application receives a spike in requests, the FaaS provider automatically handles the invocation of functions on any available server space. Cost savings are greatest for applications that receive occasional requests or inconsistent traffic.

### Serverless Architecture Can be Easier to Manage

Since the infrastructure is managed by a provider, developers can focus more of their time on writing the application's business logic. There are many questions that serverless eliminates the need to answer, such as determining how many concurrent requests you need to handle. Packaging and deploying a FaaS is much easier than deploying an entire server, as you only need to upload your code to your serverless provider. Frameworks like [Serverless](https://www.serverless.com/) make the deployment of functions efficient and easy. An architecture built on FaaS also requires no system administration expertise, which may result in labor cost savings for your team.

### Serverless Can Result in Quick Time to Market

As mentioned above, serverless development can be easy and not costly. This allows teams and even individual developers to go from having an idea to having a service running in production quickly. Serverless functions allow developers to iterate and prototype quickly.

## Cons of Serverless Functions

### The “cold start” Problem

As mentioned earlier, when a function is called, the FaaS platform has to initialize an instance of the function, and this can take anywhere from a few milliseconds to a few seconds. The initialization process can either be a “warm start”, where a previous instance of the function is used, or a “cold start”, where a new container instance has to be created for the function to run. Warm starts only occur when a function was previously called a few minutes ago before being called again. For applications with infrequent requests, the cold start latency is more common. Cloudflare workers is a function provider that claims to largely avoid the cold start issue by starting and running JavaScript code in under five milliseconds. Developers must understand their application's traffic and the work their functions are doing to determine if the cold start problem will be an issue for them.

It is also worth noting that even though serverless services automatically scale to match an increase in traffic, there is a delay before the increased usage is recognized. With both BaaS and FaaS services, the loss of full infrastructure control will often result in some degree of loss in performance optimization.

### Vendor Control and Lock-In

Whether you are using BaaS or FaaS service, you are giving up some control of your backend to a third-party vendor. These third parties may change the functionality of a service, force API upgrades, or experience bugs and downtime that may affect your application. Vendor lock-in is also an issue. While most FaaS providers offer support for writing functions in common programming languages, transferring to a new provider may be tedious if your function interacts with other services. Say you have a Firebase Cloud Function that interacts with the Firebase Realtime Database. It might not be too difficult to transfer your function's code onto AWS Lambda, but now it can't interact with your Firebase Realtime Database.

### Serverless FaaS is Stateless

You either need to construct your functions so that they are pure and don’t rely on global state, or set up a database for your functions to pull from. Depending on your use case, this could be costly or slow.

### Testing and Debugging

Writing unit tests for functions is straightforward, as you can write tests locally for the exact code that will be running on servers. Integration testing is more difficult. Many FaaS providers allow you to run functions locally, but the behavior in your local environment may not match exactly what you see in production. This is a con not only associated with FaaS but also BaaS or any architecture that relies on third-party services. Some developers may also find that debugging serverless functions is difficult, as there may be a lack of visibility as to what is happening when production events trigger functions. The debugging experience can vary between FaaS providers, and tools like Datadog’s [End-to-end Serverless Monitoring](https://www.datadoghq.com/product/serverless-monitoring/) might make it easier.

### Security

With FaaS, developers are not assigned their own private server for their code to run on. Often their code is run on a server with the code of many other developers, and this code can vary each time a function is instantiated. The architecture of having the software of multiple parties run on a single server is called multitenancy. If servers are not configured correctly, it is possible that security issues can arise, such as one function being able to access the code of another or an error in one function causing an error in another. Mature and well-developed FaaS services shouldn't have these issues, but it is something to be aware of.

### Conclusion

While I listed more cons than pros, I believe FaaS can play a valuable role when developing backend services. When utilized in the right context, many of the cons are eliminated or reduced. The ability to quickly spin up functions in production is what got me interested in learning more about serverless. For side projects that may not have extensive backend functionality and don’t have to worry about receiving a high volume of traffic, services like AWS Lambda and Firebase Cloud Functions seem like a great solution. That is not to say FaaS services only have a role when building small projects. Considering that all the major cloud providers have FaaS options, I am led to believe there are a variety of business use cases.

This is just an introduction to serverless, and there is much more I could have written on the topic. I followed a few tutorials covering AWS Lambda and built this URL shortener using Firebase Cloud Functions. The experience of building on these platforms exposed me to the pros and cons mentioned above.
