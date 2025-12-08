/**
 * Project Planning Example
 * 
 * Demonstrates how to plan a project with time estimates
 */

const { SchemaICU } = require('../src');

async function planProject() {
  const client = new SchemaICU();

  if (!client.isAuthenticated()) {
    console.error('❌ Not authenticated. Run: npm run setup');
    process.exit(1);
  }

  console.log('📊 Schema.ICU SDK - Project Planning Example\n');

  try {
    // Plan a project
    const result = await client.projectPlanner.plan(
      'Build a chat application with real-time messaging, user authentication, and file sharing',
      {
        technology: 'Node.js, React, WebSocket',
        experience: 'intermediate',
        team_size: 2
      }
    );

    const plan = result.data;

    console.log(`📋 Project: ${plan.projectName}\n`);
    console.log(`Description: ${plan.projectDescription}\n`);
    console.log(`Tasks (${plan.tasks.length}):\n`);

    let totalHours = 0;

    plan.tasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.taskName}`);
      console.log(`   ${task.taskDescription}`);
      console.log(`   ⏱️  Estimated: ${task.estimatedTimeHours} hours\n`);
      totalHours += task.estimatedTimeHours;
    });

    console.log(`📊 Total Estimated Time: ${totalHours} hours (${(totalHours / 8).toFixed(1)} days)\n`);
    console.log('✅ Project plan generated successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

planProject();
