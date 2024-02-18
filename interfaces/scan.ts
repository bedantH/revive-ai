import { ObjectId } from "mongoose";

export interface IScan {
  user: ObjectId;
  object: string;
  result: {
    recycling_methods: {
      name: string;
      steps: string[];
      resources: string[];
    }[];
    reusing_methods: {
      name: string;
      steps: string[];
      resources: string[];
    }[];
    nearest_recycling_stations: {
      name: string;
      address: string;
      distance: string;
      contact: string;
      map_link: string;
    }[];
  };
  is_completed: boolean;
  how_desc: string;
}
