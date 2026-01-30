-- Export newsletter subscribers for Beehiiv import
-- Run this in Supabase SQL Editor, then export as CSV

SELECT
  email,
  subscribed_at as created_at
FROM newsletter_subscribers
ORDER BY subscribed_at DESC;
