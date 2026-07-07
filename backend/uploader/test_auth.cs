using System;
using System.Net.Http.Headers;

class Program {
    static void Main() {
        try {
            var auth = new AuthenticationHeaderValue("Bearer", "");
            Console.WriteLine("SUCCESS");
        } catch(Exception e) {
            Console.WriteLine(e.ToString());
        }
    }
}
