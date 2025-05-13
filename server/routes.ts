import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { messageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for contact form submission
  app.post("/api/contact", async (req: Request, res: Response) => {
    try {
      // Validate the request body against the schema
      const validatedData = messageSchema.parse(req.body);
      
      // Save the message to storage
      const savedMessage = await storage.createMessage(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Message sent successfully",
        data: savedMessage
      });
    } catch (error) {
      console.error("Error saving message:", error);
      res.status(400).json({ 
        success: false, 
        message: "Failed to send message", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
