2/26/25
On server messages feature
-- how to avoid using websockets for upload status updates --

I think the sync collection function should report updates to a separate module on the backend
Maybe create a status module/api that can serve the current state of the app
the backend will report to the module as things are happening while the frontend can request endpoints that serve such data

but is that really better than just hooking up websockets?

3/4

