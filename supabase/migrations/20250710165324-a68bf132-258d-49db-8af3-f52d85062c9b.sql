-- Create a table to store code execution results
CREATE TABLE public.code_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  code TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'python',
  output TEXT,
  error TEXT,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.code_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for code execution (allow anonymous for now since no auth is set up)
CREATE POLICY "Anyone can execute code" 
ON public.code_executions 
FOR ALL 
USING (true);