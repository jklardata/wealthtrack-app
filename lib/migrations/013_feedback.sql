create table feedback (                                                                                                            
    id uuid default gen_random_uuid() primary key,                                                                                   
    user_id text,                                                                                                                    
    feedback_text text not null,                                                                                                     
    page_or_tool_name text not null,                                                                                                 
    user_type text,                                                                                                                  
    session_duration_seconds int,                                                                                                    
    tools_used_count int,                                                                                                            
    created_at timestamp with time zone default timezone('utc'::text, now()) not null                                                
  );                                                                                                                                 
                                                                                                                                     
  -- Add index for querying                                                                                                          
  create index feedback_created_at_idx on feedback(created_at desc);                                                                 
  create index feedback_page_idx on feedback(page_or_tool_name);  

    -- Enable RLS (optional, for admin-only access)                                                                                    
  alter table feedback enable row level security;    