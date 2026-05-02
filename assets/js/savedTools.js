// Saved Tools Database Functions using Supabase

// Initialize Supabase client
function getSupabase() {
    if (typeof SUPABASE_CONFIG !== 'undefined') {
        return window.supabase.createClient(
            SUPABASE_CONFIG.url,
            SUPABASE_CONFIG.anonKey
        );
    }
    return null;
}

// Save a tool to database
async function saveTool(toolId) {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase not configured' };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('saved_tools')
        .insert([
            { user_id: user.id, tool_id: toolId }
        ])
        .select();

    return { data, error: error?.message };
}

// Remove a tool from database
async function removeSavedTool(toolId) {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Supabase not configured' };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('saved_tools')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', toolId);

    return { error: error?.message };
}

// Get all saved tools for current user
async function getSavedTools() {
    const supabase = getSupabase();
    if (!supabase) return { data: [], error: 'Supabase not configured' };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: 'Not authenticated' };

    const { data, error } = await supabase
        .from('saved_tools')
        .select('tool_id, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return { data: data || [], error: error?.message };
}

// Check if a tool is saved
async function isToolSaved(toolId) {
    const supabase = getSupabase();
    if (!supabase) return false;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
        .from('saved_tools')
        .select('id')
        .eq('user_id', user.id)
        .eq('tool_id', toolId)
        .maybeSingle();

    return !!data;
}

// Toggle save/unsave a tool
async function toggleSaveTool(toolId) {
    const supabase = getSupabase();
    if (!supabase) return { saved: false, error: 'Supabase not configured' };

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { saved: false, error: 'Not authenticated' };

    const isSaved = await isToolSaved(toolId);
    
    if (isSaved) {
        const { error } = await removeSavedTool(toolId);
        return { saved: false, error };
    } else {
        const { error } = await saveTool(toolId);
        return { saved: true, error };
    }
}
