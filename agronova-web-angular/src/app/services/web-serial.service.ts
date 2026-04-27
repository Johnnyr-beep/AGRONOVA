import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSerialService {
  private port: any;
  private reader: any;

  async requestPort() {
    try {
      // @ts-ignore
      this.port = await navigator.serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      return true;
    } catch (error) {
      console.error('Error al conectar con el puerto serie:', error);
      return false;
    }
  }

  async readWeight(): Promise<number | null> {
    if (!this.port) return null;

    try {
      const decoder = new TextDecoder();
      this.reader = this.port.readable.getReader();
      
      let buffer = '';
      // Leemos durante un breve periodo para capturar la trama de la báscula
      const timeout = setTimeout(() => this.reader.releaseLock(), 2000);

      while (true) {
        const { value, done } = await this.reader.read();
        if (done) break;
        buffer += decoder.decode(value);
        
        // Buscamos un patrón común de peso (ejemplo: "ST,GS, 1240kg")
        const match = buffer.match(/(\d+)\s*kg/i) || buffer.match(/(\d+)/);
        if (match) {
          clearTimeout(timeout);
          this.reader.releaseLock();
          return parseFloat(match[1]);
        }
      }
    } catch (error) {
      console.error('Error al leer de la báscula:', error);
    } finally {
      if (this.reader) this.reader.releaseLock();
    }
    return null;
  }

  async close() {
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
  }
}
