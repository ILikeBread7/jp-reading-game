// To learn about scheduled functions and supported cron extensions,
// see: https://ntl.fyi/sched-func
export default async (req) => {
  const { next_run } = await req.json();

  console.log('Received event! Next invocation at:', next_run);
  
  const buildHookUrl = process.env.BUILD_HOOK_URL;

  if (!buildHookUrl) {
    console.error('Missing BUILD_HOOK_URL environment variable');
    return {
      statusCode: 500,
      body: 'Build hook URL not configured',
    };
  }

  try {
    const response = await fetch(buildHookUrl, {
      method: 'POST',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Build hook failed: ${response.status} ${text}`);
    }

    console.log('Build triggered successfully');

  return {
      statusCode: 200,
      body: 'Build triggered',
    };
  } catch (error) {
    console.error('Error triggering build:', error);

    return {
      statusCode: 500,
      body: 'Failed to trigger build',
    };
  }
}

export const config = {
  schedule: '*/5 * * * *',
}
