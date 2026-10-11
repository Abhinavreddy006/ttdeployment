package com.healthsetu.backend.controller;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class SignalingController {

    @MessageMapping("/signal/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Map<String, Object> routeSignal(@DestinationVariable String roomId, @Payload Map<String, Object> signalData) {
        // Whatever WebRTC data one peer sends gets immediately broadcasted to the other peers in the same room
        return signalData;
    }
}