declare const OK: any;
declare const CONT: any;
declare const DENY: any;
declare const DELAY: any;
declare const DENYSOFT: any;

declare const AUTH_METHOD_CRAM_MD5: any;

declare namespace haraka {
    interface AttachmentCallback { (content_type: string, filename: string, body: Body, stream: NodeJS.ReadableStream); }
    interface BodyFilterCallback { (content_type: string, encoding_name: string, buffer: Buffer); }
    interface MessageDataCallback { (data:string); }

    interface ILogger {
        logprotocol(...loggables: any[]);
        logdebug(...loggables: any[]);
        loginfo(...loggables: any[]);
        lognotice(...loggables: any[]);
        logwarn(...loggables: any[]);
        logerror(...loggables: any[]);
        logcrit(...loggables: any[]);
        logalert(...loggables: any[]);
        logemerg(...loggables: any[]);
    }

    interface Connection extends ILogger { 
        remote: ConnectionHost;
        local: ConnectionHost;
        hello: ConnectionHello;
        proxy: ConnectionProxy;
        transaction: Transaction;
        results: Results;
        capabilities: string[];
        current_line: string;
        last_response: string;
        remote_closed: boolean;
        relaying: boolean;
        uuid: string;
        notes: any;
    }

    class ConnectionProxy{
        allowd: boolean;
        ip: string;
        type: string;
    }
    
    class ConnectionHello{
        verb: string;
        host: string;
    }    
    
    class ConnectionHost{
        ip: string;
        host: string;
        is_private: boolean;
    }

    interface MessageStream extends NodeJS.ReadableStream {
        get_data(dataCallback:MessageDataCallback);
    }

    class Transaction {
        add_header(key: string, value: string);
        remove_header(key: string);
        add_data(line: string);
        add_leading_header(key: string, value: string);
        attachment_hooks(start: AttachmentCallback);
        set_banner(text: string, html: string)
        add_body_filter(ct_match: RegExp, filter: BodyFilterCallback);
        
        header: Header;
        parse_body: boolean;
        body: Body;
        
        uuid: string;
        mail_from: Address;
        rcpt_to: Address[];
        message_stream: MessageStream;
        data_bytes: number;
        notes: object;
        discard_data: true;
        results: Results;
    }
    
    class Results {
        add(plugin: any, stats: object);
        incr(plugin: any, stats: object);
        push(plugin: any, stats: object);
        collate(plugin:any);
        get(key:string): object;
        has(plugin_name:string, result_name: string, pattern: string | RegExp);
    }

    class MessageStreamOptions{
        line_endings: string;
        dot_stuffing: boolean;
        ending_dot: boolean;
        end: boolean;
        buffer_size: number;
        clamd_style: boolean;
    }

    class Header{
        get(key: string): string;
        get_all(key: string): string[];
        get_decoded(key: string): string;
        lines(): string[];
        headers_decoded: object;
        toString(): string;
    }

    class Body{
        bodytext: string;
        header: Header;
        children: Body[];
        buf: Buffer;
        buf_fill: number;
    }

    class Address{
        host: string;
        original: string;
        user: string;
    }

    class Todo {
        rcpt_to: Address[];
        mail_from: Address;
        domain: string;
        notes: object;
        queue_time: number;
        uuid: string;
    }    
    
    interface HMailItem extends ILogger {
        domain: string;
        path: string;
        filename: string;
        next_process: number;
        num_failures: number;
        pid: number;
        notes: object;
        refcount: number;
        todo: Todo;
        filesize: number;
        next_cb: any;
        bounce_error: any;
        hook: string;
        data_start: number;
        hooks_to_run: any[];
        current_hook: any[];
    }
}
