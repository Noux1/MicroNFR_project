import { create } from "zustand";
import { axiosInstance3 } from "../../utils/AxiosInstance";

export type EventType = {
    entityName: string;
    entityId: number;
    utilisateur: string;
    action: string;
    date: Date;
    moduleName: string;
    description?: string;
    data?: {
        property: string,
        newValue: any | null,
        oldValue: any | null
    };
}
type EventState = {
    events: EventType[],
    getAllEvents: () => Promise<void>
    getEventById: (eventId: string) => Promise<EventType>
    filterAuditEvents: (filters: { [key: string]: string | Date | null }) => Promise<EventType[]>;
}
export const useEventStore = create<EventState>((set) => (
    {
        events: [],
        getAllEvents: async () => {
            try {
                const response = await axiosInstance3.get('/audit/events')
                const events = response.data
                set({ events })
            } catch (error) {
                console.error('Failed to get events', error)
            }
        },
        getEventById: async (eventId) => {
            try {
                const response = await axiosInstance3.get(`/audit/events/${eventId}`)
                const event = response.data
                return event
            } catch (error) {
                console.error('Failed to get event', error)
            }
        },
        filterAuditEvents: async (filters) => { // Modification ici
            try {
                const response = await axiosInstance3.get('audit/filter', { params: filters }); // Utilisation des paramètres de requête pour les filtres
                const events = response.data;
                return events;
            } catch (error) {
                console.error('Failed to filter events', error);
            }
        },
    }
))