/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Message } from 'discord.js';
import Event from '../../struct/Event';
import { modbulkdel } from '../../struct/modEmbeds'
import { log } from '../../struct/mod-webhooks';

abstract class ModMessageBulkDeleteEvent extends Event {
    constructor() {
        super({
            name: 'messageDeleteBulk',
        });
    }

    public async exec(msg: Message[]) {
        const array: Message[] = [];
        await msg.forEach(mm => {
            array.push(mm)
        })
        if (!array[0].guild) return
        const hook = await log(array[0].guild, this.client);
        if (!hook) return;
    
        await modbulkdel(array, hook)
    }
}

export default ModMessageBulkDeleteEvent;
