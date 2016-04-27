<?php

namespace banners\Model;

use Doctrine\DBAL\Connection;

class BannerModel
{
    private $doctrine;

    public function __construct(Connection $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function getBannersByOrganization($organizationUrn)
    {
        $query = "SELECT * FROM banner WHERE organization_urn = ?";

        $statement = $this->doctrine->prepare($query);
        $statement->bindValue(1, $organizationUrn);
        $statement->execute();

        $banners = $statement->fetchAll();

        return $banners;
    }

    public function saveBanner($organizationUrn, $position, $content)
    {
        $query = "SELECT * FROM banner WHERE organization_urn = ? AND position = ?";

        $statement = $this->doctrine->prepare($query);
        $statement->bindValue(1, $organizationUrn);
        $statement->bindValue(2, $position);
        $statement->execute();

        $banners = $statement->fetchAll();

        if ($banners) {
            $query = "UPDATE banner SET content = ? WHERE organization_urn = ? AND position = ?";

            $statement = $this->doctrine->prepare($query);
            $statement->bindValue(1, $content);
            $statement->bindValue(2, $organizationUrn);
            $statement->bindValue(3, $position);
        } else {
            $query = "INSERT INTO banner VALUES(DEFAULT, ?, ?, ?)";

            $statement = $this->doctrine->prepare($query);
            $statement->bindValue(1, $organizationUrn);
            $statement->bindValue(2, $position);
            $statement->bindValue(3, $content);
        }

        return $statement->execute();
    }

    public function deleteBannerByPosition($organizationUrn, $position)
    {
        $query = "DELETE FROM banner WHERE organization_urn = ? AND position = ?";

        $statement = $this->doctrine->prepare($query);
        $statement->bindValue(1, $organizationUrn);
        $statement->bindValue(2, $position);

        return $statement->execute();
    }

    public function deleteAllBannersFromOrganization($organizationUrn)
    {
        $query = "DELETE FROM banner WHERE organization_urn = ?";

        $statement = $this->doctrine->prepare($query);
        $statement->bindValue(1, $organizationUrn);

        return $statement->execute();
    }
}
