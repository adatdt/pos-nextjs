
import prisma  from '@/lib/prisma';
import type {MenuItem} from "@/lib/type/type"

export const getMenu = async () =>{
        const findMenu = await prisma.menu.findMany({
                    where: {status:1},
                    orderBy:{number:"asc"}
                });
                
        const menuParent:MenuItem[]=[]
        const menuChild:MenuItem[][]=[]
        findMenu.forEach(element => {

            if(element.parent == null)
            {
                menuParent.push({name:element.name,parentId:String(element.parent),id:Number(element.id),slug:element.slug??""})
            }else
            {
                if (!menuChild[Number(element.parent)]) {
                    menuChild[Number(element.parent)] = [];
                }
                menuChild[Number(element.parent)].push({name:element.name,parentId:String(element.parent),id:Number(element.id),slug:element.slug??""})
            }

        });

        const allMenu:MenuItem[]=[]
        menuParent.forEach(element => {

            let children:MenuItem[]=[]
            if (menuChild[element.id]) 
            {
                children = getChild(String(element.id), menuChild)
            }

            allMenu.push({name: element.name, parentId: element.parentId, id: element.id, child: children, slug:element.slug})
            
        });
        return allMenu 
}

const getChild = (parentId:string, dataChild:MenuItem[][])=>{
        const allMenu:MenuItem[]=[]
        dataChild[Number(parentId)].forEach(element => {

            let children:MenuItem[]=[]
            if (dataChild[element.id]) 
            {
                children = getChild(String(element.id), dataChild)
            }

            allMenu.push({name: element.name, parentId: element.parentId, id: element.id, child: children, slug:element.slug})
            
        });
        return allMenu
}