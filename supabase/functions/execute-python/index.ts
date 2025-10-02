import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CodeExecutionRequest {
  code: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });
  }

  try {
    const { code }: CodeExecutionRequest = await req.json();
    
    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Code is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Executing Python code:', code);

    // Create a Python process to execute the code
    const pythonProcess = new Deno.Command('python3', {
      args: ['-c', code],
      stdout: 'piped',
      stderr: 'piped',
    });

    const { code: exitCode, stdout, stderr } = await pythonProcess.output();
    
    const output = new TextDecoder().decode(stdout);
    const error = new TextDecoder().decode(stderr);

    console.log('Python execution result:', { exitCode, output, error });

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Store execution result
    const { data, error: dbError } = await supabase
      .from('code_executions')
      .insert({
        code,
        language: 'python',
        output: output || null,
        error: error || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
    }

    const result = {
      success: exitCode === 0,
      output: output || '',
      error: error || '',
      executionId: data?.id || null
    };

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error executing Python code:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to execute Python code: ' + (error instanceof Error ? error.message : String(error)) 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});