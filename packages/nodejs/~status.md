        

TODO:: need to update stream example to show that when using streams you need to set the chunksize when you open the stream:

        const stream = fs.createReadStream("C:/Users/patrodg/Downloads/Microsoft ODSP Platform - ISV Pitch (2021 v1.2).pptx", { highWaterMark: 10485760 });
