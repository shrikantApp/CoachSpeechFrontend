import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock data for admin dashboard (real API calls would go here)
export const MOCK_COACHES = [
    { id: 1, name: 'James Carter', email: 'james@example.com', sport_type: 'Basketball', experience_level: 'Senior', organization: 'City Hawks FC', status: 'Active', joined: '2025-09-15' },
    { id: 2, name: 'Sarah Mitchell', email: 'sarah@example.com', sport_type: 'Football', experience_level: 'Intermediate', organization: 'Eagles Academy', status: 'Active', joined: '2025-11-02' },
    { id: 3, name: 'Tom Wilson', email: 'tom@example.com', sport_type: 'Tennis', experience_level: 'New', organization: 'Riverside Club', status: 'Inactive', joined: '2026-01-10' },
    { id: 4, name: 'Lisa Brown', email: 'lisa@example.com', sport_type: 'Soccer', experience_level: 'Senior', organization: 'Metro United', status: 'Active', joined: '2025-08-20' },
    { id: 5, name: 'Mike Zhang', email: 'mike@example.com', sport_type: 'Baseball', experience_level: 'Intermediate', organization: 'Diamond Stars', status: 'Active', joined: '2025-12-05' },
];

export const MOCK_DATASETS = [
    { id: 1, name: 'Parent Conflict Responses v1', category: 'Conflict Resolution', uploaded_on: '2026-01-05', uploaded_by: 'Admin', status: 'Active', rows: 250 },
    { id: 2, name: 'Performance Feedback Phrases', category: 'Performance', uploaded_on: '2026-01-18', uploaded_by: 'Admin', status: 'Active', rows: 180 },
    { id: 3, name: 'Injury Communication Templates', category: 'Health & Safety', uploaded_on: '2026-02-02', uploaded_by: 'Admin', status: 'Processing', rows: 95 },
];

export const MOCK_AI_USAGE = [
    { id: 1, date: '2026-02-20', coach: 'James Carter', situation_type: 'Playing time complaint', tone: 'Calm & empathetic', response_length: 320, processing_time: 2.1, quality_score: 4.5 },
    { id: 2, date: '2026-02-21', coach: 'Sarah Mitchell', situation_type: 'Parent aggression', tone: 'Firm but respectful', response_length: 410, processing_time: 2.8, quality_score: 4.2 },
    { id: 3, date: '2026-02-22', coach: 'Lisa Brown', situation_type: 'Performance concern', tone: 'Supportive', response_length: 290, processing_time: 1.9, quality_score: 4.8 },
    { id: 4, date: '2026-02-23', coach: 'Mike Zhang', situation_type: 'Injury concern', tone: 'Educational', response_length: 380, processing_time: 2.4, quality_score: 4.1 },
    { id: 5, date: '2026-02-24', coach: 'Tom Wilson', situation_type: 'Discipline issue', tone: 'Professional', response_length: 340, processing_time: 2.2, quality_score: 3.9 },
];

export const MOCK_FLAGGED = [
    { id: 1, coach: 'Tom Wilson', situation_type: 'Parent aggression', snippet: 'This behavior is completely unacceptable...', flag_reason: 'Tone too harsh', date: '2026-02-20', status: 'Pending' },
    { id: 2, coach: 'Mike Zhang', situation_type: 'Discipline issue', snippet: 'The player must be removed from the team...', flag_reason: 'Lacks empathy', date: '2026-02-22', status: 'Reviewed' },
];

export const MOCK_SITUATIONS = [
    { id: 1, coach: 'James Carter', sport_type: 'Basketball', situation_type: 'Playing time complaint', urgency: 'Same day', date: '2026-02-20', description: 'Parent demanded more playing time for child during last match and confronted me after the game in front of other parents.', parent_behavior: 'Angry', tone: 'Calm & empathetic' },
    { id: 2, coach: 'Sarah Mitchell', sport_type: 'Football', situation_type: 'Parent aggression / anger', urgency: 'Immediate', date: '2026-02-21', description: 'Parent sent threatening messages after child was benched for breaking team rules during training session.', parent_behavior: 'Aggressive / threatening', tone: 'Firm but respectful' },
    { id: 3, coach: 'Lisa Brown', sport_type: 'Soccer', situation_type: 'Performance-related concern', urgency: 'Informational', date: '2026-02-22', description: 'Parent concerned about child performance decline over last 3 weeks and asked if there were any issues.', parent_behavior: 'Calm but concerned', tone: 'Supportive' },
];

export const MOCK_RESPONSES = [
    { id: 1, coach: 'James Carter', situation_type: 'Playing time complaint', tone: 'Calm & empathetic', urgency: 'Same day', date: '2026-02-20', snippet: 'Dear Parent, I appreciate your concern and understand how important playing time is for your child...', full_response: 'Dear Parent,\n\nI appreciate your concern and understand how important playing time is for your child\'s development. I want you to know that every decision I make regarding playing time is based on what I believe is best for the team and each individual player\'s growth.\n\nPlease know that I value your child\'s contribution to our team and I am committed to supporting their development. I would be happy to schedule a meeting to discuss your concerns in more detail.\n\nWarm regards,\nCoach Carter' },
    { id: 2, coach: 'Sarah Mitchell', situation_type: 'Parent aggression', tone: 'Firm but respectful', urgency: 'Immediate', date: '2026-02-21', snippet: 'Dear Parent, I must address the messages received, which I found to be inappropriate and concerning...', full_response: 'Dear Parent,\n\nI must address the messages received, which I found to be inappropriate and concerning. While I understand you may feel frustrated about recent decisions, communication of this nature is not acceptable.\n\nOur club has a clear code of conduct that applies to all parents and guardians. I encourage you to review this policy and reach out through appropriate channels if you have concerns.\n\nProfessionally,\nCoach Mitchell' },
];

interface AdminState {
    coaches: typeof MOCK_COACHES;
    datasets: typeof MOCK_DATASETS;
    aiUsage: typeof MOCK_AI_USAGE;
    flagged: typeof MOCK_FLAGGED;
    situations: typeof MOCK_SITUATIONS;
    responses: typeof MOCK_RESPONSES;
    isLoading: boolean;
    error: string | null;
}

const initialState: AdminState = {
    coaches: MOCK_COACHES,
    datasets: MOCK_DATASETS,
    aiUsage: MOCK_AI_USAGE,
    flagged: MOCK_FLAGGED,
    situations: MOCK_SITUATIONS,
    responses: MOCK_RESPONSES,
    isLoading: false,
    error: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        addCoach: (state, action) => {
            const newCoach = { ...action.payload, id: Date.now(), status: 'Active', joined: new Date().toISOString().split('T')[0] };
            state.coaches.unshift(newCoach);
        },
        updateCoach: (state, action) => {
            const idx = state.coaches.findIndex(c => c.id === action.payload.id);
            if (idx !== -1) state.coaches[idx] = action.payload;
        },
        toggleCoachStatus: (state, action) => {
            const coach = state.coaches.find(c => c.id === action.payload);
            if (coach) coach.status = coach.status === 'Active' ? 'Inactive' : 'Active';
        },
        deleteDataset: (state, action) => {
            state.datasets = state.datasets.filter(d => d.id !== action.payload);
        },
        addDataset: (state, action) => {
            state.datasets.unshift({ ...action.payload, id: Date.now(), uploaded_on: new Date().toISOString().split('T')[0], uploaded_by: 'Admin', status: 'Active' });
        },
        markFlaggedReviewed: (state, action) => {
            const item = state.flagged.find(f => f.id === action.payload);
            if (item) item.status = 'Reviewed';
        },
        archiveFlagged: (state, action) => {
            state.flagged = state.flagged.filter(f => f.id !== action.payload);
        },
    },
});

export const { addCoach, updateCoach, toggleCoachStatus, deleteDataset, addDataset, markFlaggedReviewed, archiveFlagged } = adminSlice.actions;
export default adminSlice.reducer;
